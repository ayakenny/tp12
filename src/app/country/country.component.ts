import { Component , ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription, debounceTime, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

interface Country {
  code : string;
  libelle : string;
}

@Component({
  selector: 'country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})

export class CountryComponent implements AfterViewInit, OnDestroy {
  sub!: Subscription;

  @ViewChild('input')
  inputText!: ElementRef;

  countries: Array<Country> = [
    {     
      code: "FR",
      libelle: "France",
    },
    {     
      code: "CA",
      libelle: "Canada",
    },
    {     
      code: "AO",
      libelle: "Angola",
    },
    {     
      code: "NC",
      libelle: "Nouvelle-Calédonie",
    },
    {
      code: "AU",
      libelle: "Australie",
    }
  ];

  currentCountries: Array<Country> = [];

  constructor() {}

  ngAfterViewInit() {
    this.sub = fromEvent(this.inputText.nativeElement, 'keyup').pipe(
      debounceTime(500),
      map((x) => this.inputText.nativeElement.value)
    )
    
    .subscribe((x) => {
      if (x.trim().length == 0) {
        this.currentCountries = [];
      } else {
        this.currentCountries = this.countries.filter((y) => y.libelle.toLowerCase().startsWith(x.toLowerCase()));
      }  
    });
  }

  onBlur() {
    let meComponent = this;
    setTimeout(function () {
      meComponent.currentCountries = [];
    }, 150);
  }

  onFocus() {
    if (this.inputText.nativeElement.value.trim().length > 0) {
      this.currentCountries = this.countries.filter((y) => 
        y.libelle 
        .toLowerCase() 
        .startsWith(this.inputText.nativeElement.value.toLowerCase())
      );
    }
  }

  selectCountry(event :Event) {
    this.inputText.nativeElement.value = (event.target as HTMLElement).innerText;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}