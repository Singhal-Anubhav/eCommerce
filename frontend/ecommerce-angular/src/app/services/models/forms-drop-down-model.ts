import { Country } from "../../models/country"
import { State } from "../../models/state"

export class FormsDropDownModel {}

export interface GetResponseState{
    _embedded: {
        states: State[]
    }
}

export interface GetResponseCountry {
    _embedded: {
        countries: Country[]
    }
}
