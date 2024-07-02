
export interface IChatbotState{
    messages: {role:string, content:string}[]

    query: string

    isLoading : boolean

    temperature: number
}