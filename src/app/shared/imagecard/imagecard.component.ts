import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-imagecard',
  templateUrl: './imagecard.component.html',
  styleUrls: ['./imagecard.component.css']
})
export class ImagecardComponent implements OnInit {
  @Input() title: string;
  @Input() desc: string;
  @Input() price: number;
  @Input() id: string;
  @Input() image: string;
  constructor(private router: Router) { }


  //Routing to View List Page
  viewMenu(id){
    console.log(`${id}`);
    
    this.router.navigate(['/menu',id])

  }
  ngOnInit() {
  }

}
