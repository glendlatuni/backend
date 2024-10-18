import {gql} from "apollo-server-express";


export const countTypedef = gql`

type MemberGetStats{
    gender: String
    count: Int
}

type MemberGetStatsCategory{
    category: String
    count: Int
}


type Query {
    getFamilyCount: Int
    getMemberCount: Int
    getMemberByGender: [MemberGetStats]
    getMemberByCategory: [MemberGetStatsCategory]
}


`