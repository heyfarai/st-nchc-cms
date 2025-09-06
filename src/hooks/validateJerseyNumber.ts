// TODO: Re-implement jersey number validation with proper Payload types
type PlayerData = {
  jerseyNumber?: number;
  team?: string | { id: string } | string[];
  [key: string]: unknown;
};

/**
 * Temporarily disabled jersey number validation
 * Will be re-implemented with proper Payload types
 */
export const validateJerseyNumber = async ({ data }: { data: PlayerData }) => {
  return data;
}
