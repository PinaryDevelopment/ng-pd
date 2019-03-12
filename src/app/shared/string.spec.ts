import { isNullOrWhiteSpace } from './string';

describe('string.extensions', () => {
  it('undefined should return true', () => {
    expect(isNullOrWhiteSpace(undefined)).toBeTruthy();
  });

  it('null should return true', () => {
    expect(isNullOrWhiteSpace(null)).toBeTruthy();
  });

  it('empty should return true', () => {
    expect(isNullOrWhiteSpace('')).toBeTruthy();
  });

  it('space should return true', () => {
    expect(isNullOrWhiteSpace(' ')).toBeTruthy();
  });

  it('tab should return true', () => {
    expect(isNullOrWhiteSpace('\t')).toBeTruthy();
  });

  it('newline should return true', () => {
    expect(isNullOrWhiteSpace('\n')).toBeTruthy();
  });

  it('"a" should return false', () => {
    expect(isNullOrWhiteSpace('a')).toBeFalsy();
  });

  it('"0" should return false', () => {
    expect(isNullOrWhiteSpace('0')).toBeFalsy();
  });

  it('"." should return false', () => {
    expect(isNullOrWhiteSpace('.')).toBeFalsy();
  });
});
