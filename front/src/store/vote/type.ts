export interface WikiPreview  {
    title?: string, 
    description?: string
    thumbnail?: {
      source: string,
      width: number,
      height: number
    }
}

export interface WikiSuggestion extends WikiPreview {
  index:number
}

export interface WikiVote extends WikiPreview {
  input:string;
  label?:string;//what is display
}
