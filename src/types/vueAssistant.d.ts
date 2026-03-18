export interface AISettings {
    AIs: AISetting[];
}
export interface AISetting {
    id: number;
    name: string;
    desc: string;
    personality: string;
    knowledge: string[];
}
export interface AINameAndDesc {
    desc: string;
    personality: string;
}
