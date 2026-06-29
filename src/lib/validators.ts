export type PublicationItem = {
  title: string;
  venue: string;
  date: number;
  authors?: string;
  links?: Array<{ title?: string; url?: string }>;
  status?: string;
  image?: string;
};

export type AwardItem = {
  title: string;
  issuer: string;
  date: number;
  description?: string;
  image?: string;
};

export type EducationItem = {
  degree: string;
  school: string;
  period: string;
  description?: string;
  image?: string;
};

function failSectionItem(sectionName: string, index: number, message: string): never {
  throw new Error(`Invalid ${sectionName} item at index ${index}: ${message}`);
}

function asRecord(sectionName: string, item: unknown, index: number): Record<string, unknown> {
  if (!item || typeof item !== "object") {
    failSectionItem(sectionName, index, "expected an object");
  }

  return item as Record<string, unknown>;
}

function requireString(record: Record<string, unknown>, key: string, sectionName: string, index: number): string {
  const value = record[key];

  if (typeof value !== "string" || value.trim() === "") {
    failSectionItem(sectionName, index, `missing ${key}`);
  }

  return value;
}

function requireNumber(record: Record<string, unknown>, key: string, sectionName: string, index: number): number {
  const value = record[key];

  if (typeof value !== "number") {
    failSectionItem(sectionName, index, `missing ${key}`);
  }

  return value;
}

function optionalString(record: Record<string, unknown>, key: string, sectionName: string, index: number): string | undefined {
  const value = record[key];

  if (value !== undefined && typeof value !== "string") {
    failSectionItem(sectionName, index, `${key} must be a string when provided`);
  }

  return value;
}

export function normalizePublications(items: unknown[]): PublicationItem[] {
  return items.map((item, index) => {
    const record = asRecord("publication", item, index);

    return {
      title: requireString(record, "title", "publication", index),
      venue: requireString(record, "venue", "publication", index),
      date: requireNumber(record, "date", "publication", index),
      authors: optionalString(record, "authors", "publication", index),
      links: Array.isArray(record.links) ? record.links as Array<{ title?: string; url?: string }> : undefined,
      status: optionalString(record, "status", "publication", index),
      image: optionalString(record, "image", "publication", index),
    };
  });
}

export function normalizeAwards(items: unknown[]): AwardItem[] {
  return items.map((item, index) => {
    const record = asRecord("award", item, index);

    return {
      title: requireString(record, "title", "award", index),
      issuer: requireString(record, "issuer", "award", index),
      date: requireNumber(record, "date", "award", index),
      description: optionalString(record, "description", "award", index),
      image: optionalString(record, "image", "award", index),
    };
  });
}

export function normalizeEducation(items: unknown[]): EducationItem[] {
  return items.map((item, index) => {
    const record = asRecord("education", item, index);

    return {
      degree: requireString(record, "degree", "education", index),
      school: requireString(record, "school", "education", index),
      period: requireString(record, "period", "education", index),
      description: optionalString(record, "description", "education", index),
      image: optionalString(record, "image", "education", index),
    };
  });
}

export function rejectMdxModuleSyntax(body: string | undefined, filePath: string | undefined): void {
  if (!body) {
    return;
  }

  const moduleSyntaxPattern = /^\s*(import|export)\s/m;

  if (moduleSyntaxPattern.test(body)) {
    throw new Error(
      `Project MDX files may only use whitelisted components and must not declare imports or exports: ${filePath ?? "unknown project file"}`,
    );
  }
}
