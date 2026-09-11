import { Notice, Event, Gallery, WebsiteContent, Settings } from '../models';
import { createCrudController } from './crudFactory';

export const noticeController = createCrudController(Notice, {
  searchFields: ['title', 'content'],
});

export const eventController = createCrudController(Event, {
  searchFields: ['title', 'description', 'location'],
  defaultSort: 'eventDate',
});

export const galleryController = createCrudController(Gallery, {
  searchFields: ['title', 'description', 'category'],
  defaultSort: 'sortOrder',
});

export const websiteContentController = createCrudController(WebsiteContent, {
  searchFields: ['title', 'content', 'key'],
});

export const settingsController = createCrudController(Settings, {
  searchFields: ['siteName', 'contactEmail'],
});
