# Superseded — do not run these

These are the migrations for the original Bolt-generated project
(`vjjhsagfkwqafflbchfq`). They are kept only as a record of what that
database contained, so its rows can be interpreted if they are ever
exported.

**Running them would recreate the vulnerable schema.** `dark_scene.sql`
grants `FOR SELECT TO public` on `donation_receipts`, `members`,
`member_problems`, `volunteer_certificates` and `appointment_letters` —
which, combined with the anon key that ships in the client bundle, is what
exposed donor names, PAN and Aadhaar numbers and member home addresses.

The live schema is the three migrations in the parent directory. They are
not a patched version of these; the database was rebuilt from scratch on
`nheeyglhwaofxhwgkawm` so that the access rules were right from the first
row rather than tightened afterwards.
