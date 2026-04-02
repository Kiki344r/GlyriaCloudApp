export {}

declare global {
  interface accountData {
    firstName: string
    lastName: string
    email: string
    groups: groupData[]
    UUID: string
  }
}
