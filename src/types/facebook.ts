// Facebook Post Type
export interface FacebookAttachmentData {
    media_type: string;
    url: string;
    title?: string;
    description?: string;
  }
  
  export interface FacebookAttachment {
    data: FacebookAttachmentData[];
  }
  
  export interface FacebookPost {
    id: string;
    message?: string;
    full_picture?: string;
    created_time: string;
    attachments?: FacebookAttachment;
  }
  
  // Facebook Event Type
  export interface FacebookEventPlace {
    name: string;
    location?: {
      city?: string;
      country?: string;
      street?: string;
      zip?: string;
    };
  }
  
  export interface FacebookEventCover {
    source: string;
    offset_x?: number;
    offset_y?: number;
  }
  
  export interface FacebookEvent {
    id: string;
    name: string;
    description?: string;
    start_time: string;
    end_time?: string;
    place?: FacebookEventPlace;
    cover?: FacebookEventCover;
  }