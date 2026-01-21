import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BLOG_STATE_SERVICE } from './features/blogs/tokens/blog.tokens';
import { Navbar } from './shared/components/navbar/navbar';
import { HlmCard, HlmCardContent } from '@shared/ui/card';
import { HlmSeparator } from '@shared/ui/separator';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, HlmCard, HlmCardContent, HlmSeparator],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  private readonly blogState = inject(BLOG_STATE_SERVICE);

  ngOnInit(): void {
    // Load user comments on app initialization
    this.blogState.loadUserComments();
  }
}
