export type Prediction = {
    uuid: string;
    date: number;
    predictor: string;
    assetId: number;
    notation: number;
    notationReason: string;
};

export type PredictionForm = Omit<Prediction, 'predictor' | 'uuid'>;
export type StakedPredictionForm = PredictionForm & { stake: string };