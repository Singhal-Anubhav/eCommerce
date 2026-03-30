import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { GetResponseCountry, GetResponseState } from './models/forms-drop-down-model';
import { Country } from '../models/country';
import { State } from '../models/state';

@Injectable({
  providedIn: 'root',
})
export class FormsDropDownService {

  private contriesUrl = 'http://localhost:8080/api/countries';
  private stateUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }

  getCountryList(): Observable<Country[]>{
    return this.httpClient.get<GetResponseCountry>(this.contriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStateList(countryCode: string): Observable<State[]>{
    const baseURL : string = `${this.stateUrl}/search/findByCountryCode?code=${countryCode}`;
    return this.httpClient.get<GetResponseState>(baseURL).pipe(
      map(response => response._embedded.states)
    );
  }
}
