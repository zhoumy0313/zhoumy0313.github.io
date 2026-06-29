export const sectionTypes = ["markdown", "collection-list", "timeline"] as const;

export type SectionType = (typeof sectionTypes)[number];

export type HomeSection = {
  type: SectionType;
  title: string;
  source: "profile" | "education" | "publications" | "awards" | "projects" | "notes";
  limit?: number;
  filter?: {
    featured?: boolean;
  };
};

export function assertKnownSection(section: HomeSection): HomeSection {
  if (!sectionTypes.includes(section.type)) {
    throw new Error(`Unknown homepage section type: ${section.type}`);
  }

  return section;
}
