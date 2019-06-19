import { QueryTermType } from './query-term-type.enum';
import { QueryOperator } from './query-operator.enum';

export class QueryTerm {
  public type: QueryTermType;
  public operator: QueryOperator;
  public field: string;
  public hasWildcard = false;
  public isInclusiveRange = false;
  public isExclusiveRange = false;

  public set range(range: string[]) {
    if (!range || range.length !== 2) {
      throw new Error('Range search must include exactly two range values.');
    }

    this._range = range;
    this.type = QueryTermType.Range;
  }
  public get range(): string[] {
    return this._range;
  }
  private _range: string[];

  public includeFuzzyMatches = false;
  public set fuzzySimilarity(fuzzySimilarity: number) { // number | string // typeof fuzzySimilarity === "string"
    if (this.type === QueryTermType.Phrase) {
      throw new Error('Fuzzy search is only applicable to a single word term.');
    }

    if (!fuzzySimilarity) {
      this._fuzzySimilarity = 0.5;
    } else if (fuzzySimilarity >= 0 && fuzzySimilarity <= 1) {
      this._fuzzySimilarity = fuzzySimilarity;
    } else {
      throw new Error('Fuzzy similarity value needs to be a value between 0 and 1.');
    }
  }
  public get fuzzySimilarity(): number {
    return this._fuzzySimilarity;
  }
  private _fuzzySimilarity: number;

  public onlyIncludeProximityMatches = false;
  public set proximityDistance(proximityDistance: number) {  // number | string // typeof proximityDistance === "string"
    if (this.type === QueryTermType.SingleTerm) {
      throw new Error('Proximity search is only applicable to a phrase.');
    }

    if (!proximityDistance) {
      throw new Error('Proximity search requires a distance value.');
    }

    if (proximityDistance < 1 || proximityDistance % 1 !== 0) {
      throw new Error('Proximity search requires a positive integer distance value.');
    }

    this._proximityDistance = proximityDistance;
  }
  public get proximityDistance(): number {
    return this._proximityDistance;
  }
  private _proximityDistance: number;

  public boostTerm = false;
  public set boostFactor(boostFactor: number) {  // number | string // typeof boostFactor === "string"
    if (!boostFactor) {
      throw new Error('Boosted search requires a boost factor value.');
    }

    if (boostFactor < 0) {
      throw new Error('Boosted search requires a positive boost factor value.');
    }

    this._boostFactor = boostFactor;
  }
  public get boostFactor(): number {
    return this._boostFactor;
  }
  private _boostFactor: number;

  constructor(public term: string = '') { // update to take a string(a.k.a term) or string[](a.k.a. range) and an optional field
    this.type = term.indexOf(' ') === -1 ? QueryTermType.SingleTerm : QueryTermType.Phrase;
  }
}
