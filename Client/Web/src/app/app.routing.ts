import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'chat',
    loadChildren: 'src/app/component/page/chat/chat.module#ChatModule'
  },
  {
    path: 'login',
    loadChildren: 'src/app/component/page/login/login.module#LoginModule'
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes
    )
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRouting {
}
