import { Component } from '@angular/core';
import { Navbar } from '../../shared/navbar/navbar';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-home',
  imports: [RouterModule,Navbar,MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
