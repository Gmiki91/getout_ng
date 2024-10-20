import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Komment, NewKommentData } from '../models/komment.model';
import { KommentService } from './comment.service';

describe('KommentService', () => {
  let service: KommentService;
  let httpClient: jest.Mocked<HttpClient>;

  const mockKomment: Komment = {
    id: '1',
    text: 'Test comment',
    userName: 'Username',
    timestamp: '2024-01-01T12:00:00Z',
  };
  const newKommentData: NewKommentData = {
    text: 'Test new comment',
    userId: '123',
    eventId: '456',
    timestamp: '2024-01-01T12:00:00Z',
  };

  beforeEach(() => {
    const httpClientMock = {
      post: jest.fn(),
      get: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        KommentService,
        { provide: HttpClient, useValue: httpClientMock },
      ],
    });

    service = TestBed.inject(KommentService);
    httpClient = TestBed.inject(HttpClient) as jest.Mocked<HttpClient>;
  });

  it('should add a comment using addKomment', () => {
    httpClient.post.mockReturnValue(of(mockKomment));
    service.addKomment(newKommentData);
    expect(httpClient.post).toHaveBeenCalledWith(
      service['url'],
      newKommentData
    );
    expect(service.comments()).toContain(mockKomment);
  });

  it('should handle error when addKomment fails', () => {
    httpClient.post.mockReturnValue(
      throwError(() => new Error('Failed to add comment'))
    );

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    service.addKomment(newKommentData);

    expect(httpClient.post).toHaveBeenCalledWith(
      service['url'],
      newKommentData
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to add comment:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('should retrieve comments using getKomments', () => {
    const eventId = '456';
    const mockComments: Komment[] = [mockKomment];

    httpClient.get.mockReturnValue(of(mockComments));
    service.getKomments(eventId);

    expect(httpClient.get).toHaveBeenCalledWith(`${service['url']}/${eventId}`);
    expect(service.comments()).toEqual(mockComments);
  });

  it('should handle error when getKomments fails', () => {
    const eventId = '456';
    httpClient.get.mockReturnValue(
      throwError(() => new Error('Failed to get comments'))
    );
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    service.getKomments(eventId);
    expect(httpClient.get).toHaveBeenCalledWith(`${service['url']}/${eventId}`);
    
    expect(service.comments().length).toBe(0); // No comments added

    consoleSpy.mockRestore();
  });
});
