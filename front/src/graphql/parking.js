export const ADD_PARKING = `
mutation ($args: AddPlaceParkingInput!) {
  addPlaceParking(args: $args) {
    id
  }
}
`;

export const GET_PARKINGS = `
query GetPlaceParkings($args: GetPlaceParkingInput!) {
  getPlaceParkings(args: $args) {
    parkings {
      id
      etage
      user {
        id
        username
      }
      tempsOccupation
    }
    count
  }
}
`;

export const UPDATE_PARKING = `
mutation UpdatePlaceParking($args: UpdatePlaceParkingInput!) {
  updatePlaceParking(args: $args) {
    id
  }
}
`;
export const DELETE_PARKING = `
mutation DeletePlaceparking($id: ID!) {
  deletePlaceparking(id: $id)
}`;
