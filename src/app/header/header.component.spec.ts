import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { UserService } from '../services/user.service';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockUserService: jest.Mocked<UserService>;

  describe('Unit tests', () => {
    beforeEach(async () => {
      mockUserService = {
        user: jest.fn().mockReturnValue({ name: 'Lekvár' }),
      } as unknown as jest.Mocked<UserService>;
      await TestBed.configureTestingModule({
        imports: [HeaderComponent],
        providers: [
          { provide: UserService, useValue: mockUserService },
          provideHttpClient(),
          provideHttpClientTesting(),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(HeaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display the username', () => {
      const usernameElement = fixture.debugElement.query(
        By.css('.username')
      ).nativeElement;
      expect(usernameElement.textContent).toContain('Lekvár');
    });
  });
});
