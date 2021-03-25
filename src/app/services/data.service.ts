import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Asset } from '../models/asset.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  barcodeData: any;

  constructor(private http: HttpClient) { }

  findAsset(barcode: string): Observable<Asset> {
    return this.http.get<Asset>(`http://localhost:8080/mnbca/assets/605cd1f1bed0cc4fbfc0ae3d/${barcode}`);
  }
}
