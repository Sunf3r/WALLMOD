{ pkgs, ... }: {

  # Which nixpkgs channel to use.
  channel = "unstable"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.deno
    pkgs.btop
    pkgs.python3
    pkgs.nodejs_20
    pkgs.postgresql
  ];

  # Sets environment variables in the workspace
  env = {
    SOME_ENV_VAR = "hello";
  };

  # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
  idx.extensions = [
    # "angular.ng-template"
  ];

  # Enable previews and customize configuration
  idx.previews = {
#     enable = true;
#     previews = [
#       {
#         command = [
#           "npm"
#           "run"
#           "start"
#           "--"
#           "--port"
#           "$PORT"
#           "--host"
#           "0.0.0.0"
#           "--disable-host-check"
#         ];
#         manager = "web";
#         id = "web";
#       }
#     ];
  };
}
