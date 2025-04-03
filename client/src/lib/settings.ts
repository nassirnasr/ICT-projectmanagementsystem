type RouteAccessMap = {
    [key: string]: string[];
  };
  
  export const routeAccessMap: RouteAccessMap = {
    "/admin(.*)": ["admin"],
    "/team_member(.*)": ["team_member"],
    "/team_leader(.*)": ["team_leader"],
    "/list/projects": ["admin"],
    "/list/priority": ["admin"],
    "/list/recent": ["admin", "team_leader", "team_member"],
    "/list/search": ["admin", "team_leader", "team_member"],
    "/list/settings": ["admin", "team_leader", "team_member"],
    "/list/teams": ["admin"],
    "/list/timeline": ["admin", "team_leader", "team_member"],
    "/list/upcoming": ["admin", "team_leader", "team_member"],
    "/list/users": ["admin", "team_leader"],
    
  };

