export type Prediction = BasicPrediction | StakedPrediction;

export type BasicPrediction = {
    id: string;
    date: number;
    predictor: string;
    assetId: number;
    notation: number;
    notationReason: string;
};

export type StakedPrediction = BasicPrediction & {
    stake: number;
    isAssessed: boolean;
};

export type PredictionForm = Omit<Prediction, 'predictor' | 'id'>;
export type StakedPredictionForm = PredictionForm & { stake: string };