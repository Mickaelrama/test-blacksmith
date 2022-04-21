import { gql } from "apollo-server";

export default gql`
  type PlaceParking {
    id: ID
    etage: Int
    user: User
    tempsOccupation: Int
  }

  input AddPlaceParkingInput {
    etage: Int!
  }

  input UpdatePlaceParkingInput {
    id: ID!
    etage: Int
    tempsOccupation: Int
    userId: ID
  }

  input GetPlaceParkingInput {
    dispo: Boolean
    etage: Int
    limit: Int!
    offset: Int!
  }

  type Mutation {
    addPlaceParking(args: AddPlaceParkingInput!): PlaceParking
    updatePlaceParking(args: UpdatePlaceParkingInput!): PlaceParking
    deletePlaceparking(id: ID!): Int
  }

  type PlaceParkingOutPut {
    parkings: [PlaceParking]
    count: Int
  }

  type Query {
    getPlaceParkings(args: GetPlaceParkingInput!): PlaceParkingOutPut
  }
`;
