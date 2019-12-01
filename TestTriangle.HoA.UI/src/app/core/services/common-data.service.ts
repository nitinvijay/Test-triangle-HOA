import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DropdownModel, BaseResponse } from 'src/app/shared/models/common.model';
import { Customers } from 'src/app/customers/customers.model';
import { URLs } from '../config/urls';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonDataService {

  constructor(private httpService: HttpClient) { }

  getCountries(
    ): Observable<BaseResponse<DropdownModel>> {
      return this.httpService.get<BaseResponse<DropdownModel>>(
        `${URLs.common.getCountries}`
      );
    }

    getStatus(
      ): Observable<BaseResponse<DropdownModel>> {
        return this.httpService.get<BaseResponse<DropdownModel>>(
          `${URLs.common.getStatus}`
        );
      }
  // getCountries(): Observable<DropdownModel[]> {
  //   const countries = [
  //     {
  //       Display: 'Ireland',
  //       Value: 'IL'
  //     },
  //     {
  //       Display: 'England',
  //       Value: 'EN'
  //     },
  //     {
  //       Display: 'Wales',
  //       Value: 'WL'
  //     }
  //   ];
  //   return of(countries);
  // }
}
