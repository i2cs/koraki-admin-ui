import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MemoryDataHolderServiceService {
  public store: Map<string, object> = new Map();
  constructor() { }
}
