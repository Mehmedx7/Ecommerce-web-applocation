// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  let pincodes = {
    "401202": ["Vasai West","Maharashtra" ],
    "401208": ["Vasai East", ""],
    "401203": ["Virar", "Maharashtra"],
  };
  res.status(200).json(pincodes);
}
