const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
} = require('../../src/model/data/memory/index');
const MemoryDB = require('../../src/model/data/memory/memory-db');

describe('memory', () => {
  // eslint-disable-next-line no-unused-vars
  let db;

  beforeEach(() => {
    db = new MemoryDB();
  });

  test('writeFragment() throws when invalid object is passed', () => {
    expect(async () => await writeFragment({})).rejects.toThrow();
    expect(async () => await writeFragment({ ownerId: 'test' })).rejects.toThrow();
  });

  test('writeFragment() returns undefined', async () => {
    const fragment = {
      ownerId: 'test',
      id: 'a123',
      created: '2021-11-02T15:09:50.403Z',
      updated: '2021-11-02T15:09:50.403Z',
      type: 'text/plain',
      size: 128,
    };
    const result = await writeFragment(fragment);
    expect(result).toBe(undefined);
    expect(async () => await writeFragment({ ownerId: 'test', id: 'a123' }).toBe(undefined));
    expect(
      async () =>
        await writeFragment({
          ownerId: 'test',
          id: 'a123',
          updated: '2021-11-02T15:09:50.403Z',
          type: 'text/plain',
        }).toBe(undefined)
    );
  });

  test('readFragment() throws for invalid ownerId and id', async () => {
    expect(async () => await readFragment('test', '').rejects.toThrow());
    expect(async () => await readFragment('test', 'a123').rejects.toThrow());
    await writeFragmentData('test', 'c123', []);
    expect(async () => await readFragment('test1', 'c123').rejects.toThrow());
    expect(async () => await readFragment('test', 'd123').rejects.toThrow());
  });

  test('readFragment() returns data for requested ownerId and id. Otherwise it throws an error', async () => {
    const ownerId = 'test';
    const id = 'b123';
    const metadata = {
      ownerId: ownerId,
      id: id,
      created: '2021-11-02T15:09:50.403Z',
      updated: '2021-11-02T15:09:50.403Z',
      type: 'text/plain',
      size: 128,
    };
    await writeFragment(metadata);
    const result1 = await readFragment(ownerId, id);
    expect(result1).toEqual(metadata);

    const metadata1 = {
      ownerId: ownerId,
      id: id,
      created: '2021-11-02T15:09:50.403Z',
      updated: '2021-11-02T15:09:50.403Z',
    };
    await writeFragment(metadata1);
    const result2 = await readFragment(ownerId, id);
    expect(result2).toEqual(metadata1);
    const result3 = await readFragment(ownerId, '');
    expect(result3).toBe(undefined);
    const result4 = await readFragment('', id);
    expect(result4).toBe(undefined);
    const result5 = await readFragment('', '');
    expect(result5).toBe(undefined);
  });

  test('writeFragmentData() throws for invalid ownerId and id', () => {
    expect(async () => await writeFragmentData('', '', []).rejects.toThrow());
    expect(async () => await writeFragmentData('test', '', []).rejects.toThrow());
    expect(async () => await writeFragmentData('', 'a123', []).rejects.toThrow());
    expect(async () => await writeFragmentData(1, 2, []).rejects.toThrow());
  });

  test('writeFragmentData() returns undefined', async () => {
    const result1 = await writeFragmentData('test', 'a123', []);
    const result2 = await writeFragmentData('', '', []);
    expect(result1).toBe(undefined);
    expect(result2).toBe(undefined);
  });

  test('readFragmentData() returns the data for requested ownerId and id. Otherwise it throws an error', async () => {
    const ownerId = 'test';
    const id = 'a123';
    const data = [1, 2, 3, 4, 5];
    await writeFragmentData(ownerId, id, data);
    const result1 = await readFragmentData(ownerId, id);
    expect(result1).toBe(data);
    expect(Array.isArray(result1)).toBe(true);
    const result2 = await readFragmentData('test1', 'a321');
    expect(result2).toBe(undefined);
    const result3 = await readFragmentData('', 'a321');
    expect(result3).toBe(undefined);
    const result4 = await readFragmentData('test1', '');
    expect(result4).toBe(undefined);
    expect(async () => await readFragmentData(1, 2)).rejects.toThrow();
  });
});
