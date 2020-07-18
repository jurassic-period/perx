export const VEHICLES_URL =
  "https://jlrc.dev.perx.ru/carstock/api/v1/vehicles/?";
export const DEALERS_URL =
  "https://jlrc.dev.perx.ru/carstock/api/v1/dealers/?id__in=";

export const pulledOffices = (acc, { id, address }) => ({
  ...acc,
  [id]: address,
});

export const preperedDealers = (acc, d) => {
  const { id, name, offices } = d;
  const obj = offices.reduce(pulledOffices, {});
  return { ...acc, [id]: { name, ...obj } };
};
