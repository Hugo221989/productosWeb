import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import spainCities from '../../../../assets/spainCities/spainCities.json';
import { SpainCities } from 'src/app/models/spainCities';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  public countryList:SpainCities[] = spainCities;

  constructor(private httpClient: HttpClient) { }

  public getCountryAccesToken() {
    let headers = new HttpHeaders({
      'api-token':'VKgwLR-rOdS9CHVD4fZ7Il8nUzOVaQadJmcAEwTNjQo8Wp-O6cO0yRWH6YoGg20w-YU',
      'Accept': 'application/json',
      'user-email': 'hugoonetto@gmail.com'
    })
    return this.httpClient.get<any>(
      `https://www.universal-tutorial.com/api/getaccesstoken`, { headers:headers}
    );
  }

  public getCities() {
    spainCities.sort((a, b) => (a.city > b.city) ? 1 : -1)
    return spainCities;
  }


}
