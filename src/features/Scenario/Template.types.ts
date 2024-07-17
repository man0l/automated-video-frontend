export interface Template {
  id: string;
  title: string;
  content: string;
  scenarioCount: number;
}

export interface CreateTemplatePayload {
  title: string;
  content: string;
}

export interface UpdateTemplatePayload {
  title?: string;
  content?: string;
}
