let noname = "<noname>";

/** canonicalize name */
export function playerName(name: string | undefined) {
  return name?.trim() || noname;
}

/** set "noname" */
export function setNoname(name: string) {
  noname = name;
}
