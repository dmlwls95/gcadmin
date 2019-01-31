import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {

  iconItem = [
    'bug',
    'area-chart',
    'address-card',
    'bar-chart',
    'bar-chart-o',
    'book',
    'line-chart',
    'pie-chart',
    'cog',
    'cogs',
    'file',
    'bell',
    'calendar',
    'check',
    'close',
    'comment',
    'comments',
    'database',
    'image',
    'navicon',
    'home',
    'print',
    'question-circle',
    'star',
    'tag',
    'tags',
    'user',
    'usd',
    'file',
    'file-o',
    'file-text-o',
    'file-word-o',
    'file-excel-o',
    'file-powerpoint-o',
    'file-pdf-o',
    'file-code-o',
    'file-audio-o',
    'file-image-o',
    'file-video-o',
    'file-zip-o',
    'far fa-building',
  ];

  constructor() { }

  ngOnInit() {
  }

}