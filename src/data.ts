export interface IGenerateOptions {
  label?: string;
}

export interface IRawSet<T> {
  label: string;
  values: ReadonlyArray<T>;
}

export interface ISet<T> {
  label: string;
  sets: ReadonlyArray<string>;
  c: number;
  values: ReadonlyArray<T>;
  degree: number;
}

function generateSubset<T>(
  members: IRawSet<T>[],
  notMembers: IRawSet<T>[],
  lookup: ReadonlyMap<IRawSet<T>, Set<T>>
): ISet<T> {
  const sets = members.map((s) => s.label);
  const label = members.join('∩');
  const others = members.slice(1).map((s) => lookup.get(s)!);
  const not = notMembers.map((s) => lookup.get(s)!);
  const values: T[] = members[0].values.filter((v) => others.every((o) => o.has(v)) && not.every((o) => !o.has(v)));

  return {
    sets,
    label,
    c: values.length,
    values,
    degree: sets.length,
  };
}

export function extractSets<T>(data: ReadonlyArray<IRawSet<T>>, options: IGenerateOptions = {}) {
  const sets: ISet<T>[] = [];
  const lookup = new Map(data.map((s) => [s, new Set(s.values)]));
  const base = data.slice(0, 3);
  switch (base.length) {
    case 1:
      sets.push(generateSubset([base[0]], [], lookup));
      break;
    case 2:
      sets.push(
        generateSubset([base[0]], [base[1]], lookup),
        generateSubset([base[1]], [base[0]], lookup),
        generateSubset([base[0], base[1]], [], lookup)
      );
      break;
    case 3:
      sets.push(
        generateSubset([base[0]], [base[1], base[2]], lookup),
        generateSubset([base[1]], [base[0], base[2]], lookup),
        generateSubset([base[2]], [base[0], base[1]], lookup),
        generateSubset([base[0], base[1]], [base[2]], lookup),
        generateSubset([base[1], base[2]], [base[0]], lookup),
        generateSubset([base[2], base[0]], [base[1]], lookup),
        generateSubset([base[0], base[1], base[2]], [], lookup)
      );
      break;
  }
  return {
    labels: sets.map((s) => s.label),
    datasets: [
      {
        label: options.label ?? 'Venn Diagram',
        data: sets,
      },
    ],
  };
}
