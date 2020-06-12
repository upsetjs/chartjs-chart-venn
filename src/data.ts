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

function generateSubset<T>(raws: IRawSet<T>[]): ISet<T> {
  const sets = raws.map((s) => s.label);
  const label = raws.join('∩');
  const others = raws.slice(1).map((s) => new Set(s.values));
  const values: T[] = raws[0].values.filter((v) => others.every((o) => o.has(v)));

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
  const base = data.slice(0, 3);
  base.forEach((b) => sets.push(Object.assign({}, b, { c: b.values.length, sets: [b.label], degree: 1 })));
  switch (base.length) {
    case 2:
      sets.push(generateSubset([base[0], base[1]]));
      break;
    case 3:
      sets.push(
        generateSubset([base[0], base[1]]),
        generateSubset([base[1], base[2]]),
        generateSubset([base[2], base[0]]),
        generateSubset([base[0], base[1], base[2]])
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
