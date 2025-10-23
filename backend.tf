terraform {
  backend "remote" {
    organization = "solutionserj"

    workspaces {
      name = "api-hub-showcase"
    }
  }
}