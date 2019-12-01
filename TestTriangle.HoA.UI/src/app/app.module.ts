import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SessionStorageService } from './core/services/session-storage.service';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { EncodeHttpParamsInterceptor } from './core/interceptor/encodeHttpParams.interceptor';
import { HttpCacheService } from './core/services/cache.service';
import { HttpCachingInterceptor } from './core/interceptor/cache.interceptor';
import { HttpCache } from './shared/models/cache.model';
import { TokenInterceptor } from './core/interceptor/token.interceptor';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { i18nFilePath } from './core/config/i18n-config';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdalService, AdalGuard, AdalInterceptor } from 'adal-angular4';
import { GlobalConfirmationModule } from './core/components/global-confirmation/global-confirmation.module';
import { GlobalToasterModule } from './core/components/global-toaster/global-toaster.module';
import { URLs } from './core/config/urls';
import { DashboardComponent } from './dashboard/dashboard.component';

const cacheUrls = [
  URLs.common.getCountries,
  URLs.common.getStatus
];
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule,
    CoreModule,
    HttpClientModule,
    GlobalConfirmationModule,
    GlobalToasterModule
  ],
  providers: [
    AdalService,
    AdalGuard,
    SessionStorageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: EncodeHttpParamsInterceptor,
      multi: true
    },
    {
      provide: LOCALE_ID,
      useFactory: (translate: SessionStorageService) => {
        return translate.getCurrentCulture;
      },
      deps: [SessionStorageService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: (http: HttpCacheService) => {
        const cache = new HttpCachingInterceptor(http);
        cache.cacheUrls = cacheUrls;
        return cache;
      },
      deps: [HttpCacheService],
      multi: true
    },
    HttpCacheService,
    {
      provide: HttpCache,
      useClass: HttpCacheService
    },
    { provide: HTTP_INTERCEPTORS, useClass: AdalInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
