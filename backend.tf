terraform {
  backend "remote" {
    organization = "solutionserj"

    workspaces {
      name = "apihub-showcase"
    }
  }
}