const { randomUUID } = require('crypto');
const contentType = require('content-type');
const md = require('markdown-it')();
const sharp = require('sharp');
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');
const logger = require('../logger');

const validTypes = [
  `text/plain`,
  `text/markdown`,
  `text/html`,
  `application/json`,
  `image/png`,
  `image/jpeg`,
  `image/webp`,
  `image/gif`,
];

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (ownerId === undefined || type === undefined) {
      throw new Error('OwnerId and type must be provided');
    }

    if (!Number.isInteger(size) || size < 0) {
      logger.debug({ size }, 'Invalid content size');
      throw new Error('Size must be a positive number');
    }

    if (id) {
      this.id = id;
    } else {
      this.id = randomUUID();
    }

    if (created) {
      this.created = created;
    } else {
      this.created = new Date().toISOString();
    }
    if (updated) {
      this.updated = updated;
    } else {
      this.updated = new Date().toISOString();
    }

    const parsedType = contentType.parse(type);
    if (!this.formats.includes(parsedType.type)) {
      logger.debug({ parsedType }, 'Invalid content type');
      throw new Error('Not supported content type');
    }
    this.type = contentType.format(parsedType);

    this.ownerId = ownerId;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static byUser(ownerId, expand = false) {
    return listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const fragment = await readFragment(ownerId, id);

    if (fragment) {
      const { created, updated, type, size } = fragment;
      return new Fragment({ id, ownerId, created, updated, type, size });
    } else {
      throw new Error('Fragment does not exist in DB');
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    this.updated = new Date().toISOString();
    writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  setData(data) {
    if (!data) {
      throw new Error('There is no data to store');
    }
    this.size = data.length;
    this.updated = new Date().toISOString();
    writeFragmentData(this.ownerId, this.id, data);
  }

  async convertData(ext) {
    const data = await this.getData();
    let convertedData;

    if (this.isText) {
      if (ext === '.txt') {
        this.type = 'text/plain';
      } else if (ext === '.html') {
        if (this.type === 'text/markdown') {
          let decoder = new TextDecoder('utf-8');
          convertedData = md.render(decoder.decode(data));
          this.type = 'text/html';
        } else if (this.type === 'text/html') {
          logger.info(`Requested to convert to html`);
        } else {
          throw new Error(`Cannot convert ${this.type} to html`);
        }
      } else if (ext === '.md') {
        if (this.type === ('text/plain' | 'text/html')) {
          throw new Error(`Cannot convert ${this.type} to markdown`);
        } else if (this.type === 'text/markdown') {
          logger.info(`Requested to convert to markdown`);
        }
      } else {
        throw new Error(`Cannot convert ${this.type} to ${ext}`);
      }
    } else if (this.type.startsWith('application')) {
      if (ext === '.txt') {
        this.type = 'text/plain';
      } else if (ext === '.json') {
        logger.info(`Requested to convert to json`);
      } else {
        throw new Error(`Cannot convert ${this.type} to ${ext}`);
      }
    } else {
      if (ext === '.png') {
        convertedData = await sharp(data).png().toBuffer();
        this.type = 'image/png';
      } else if (ext === '.jpg') {
        convertedData = await sharp(data).jpeg().toBuffer();
        this.type = 'image/jpeg';
      } else if (ext === '.webp') {
        convertedData = await sharp(data).webp().toBuffer();
        this.type = 'image/webp';
      } else if (ext === '.gif') {
        convertedData = await sharp(data).gif().toBuffer();
        this.type = 'image/gif';
      } else {
        throw new Error(`Cannot convert ${this.type} to ${ext}`);
      }
    }

    if (!convertedData) {
      return data;
    } else {
      await this.save();
      return convertedData;
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    return contentType.parse(this.type).type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    let isTextContent = false;

    if (this.mimeType.startsWith('text/')) {
      isTextContent = true;
    }
    return isTextContent;
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    return validTypes;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const { type } = contentType.parse(value);
    return validTypes.includes(type);
  }
}

module.exports.Fragment = Fragment;
