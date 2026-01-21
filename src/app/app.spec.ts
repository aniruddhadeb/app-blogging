import { TestBed } from "@angular/core/testing";
import { MockBlogStateService } from "./testing/mocks/blog-state-service.mock";
import { BLOG_STATE_SERVICE } from "./features/blogs/tokens/blog.tokens";
import { App } from "./app";
import { AUTH_SERVICE, STORAGE_SERVICE } from "./core/tokens/service.tokens";
import { MockAuthService } from "./testing/mocks/auth-service.mock";
import { MockStorageService } from "./testing/mocks/storage-service.mock";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

describe('App', () => {
  let mockBlogState: MockBlogStateService;
  let mockAuthService: MockAuthService;
  let mockStorageService: MockStorageService;

  beforeEach(async () => {
    mockBlogState = new MockBlogStateService();
    mockAuthService = new MockAuthService();
    mockStorageService = new MockStorageService();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: BLOG_STATE_SERVICE, useValue: mockBlogState },
        { provide: AUTH_SERVICE, useValue: mockAuthService },
        { provide: STORAGE_SERVICE, useValue: mockStorageService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: { params: {} },
          },
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call loadUserComments on ngOnInit', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    // Spy on the method
    const spy = vi.spyOn(mockBlogState, 'loadUserComments');

    app.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });
});

