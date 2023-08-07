## Eduqat Course Functions

## Requirements
- node>=16
- serverless framework and cli https://www.serverless.com/framework/docs/getting-started
- docker (for local test)
- mongodb db atlas (free or paid)

## How to run
> for this guide will using `pnpm` but fell free to use another package manager (npm,yarn)
- run install `pnpm install`
- run `mysql` docker container `docker compose up -d`
- create mongodb cluster and db on atlas https://cloud.mongodb.com/
- setup `.env` copy `env.example` to `.env` and replace the `mysql` and `mongo` server uri
- Generate prisma client
  - run `pnpm prisma generate --schema src/prismas/mongodb/schema.prisma` for mongo, then
  - run `pnpm prisma generate --schema src/prismas/mysql/schema.prisma` for mysql
- run migration for mysql `pnpm migrate`
- run serverless offline server for api testing `sls offline start`

## Test Result
```bash
> pnpm jest src/tests/service.spec.ts
 PASS  src/tests/service.spec.ts
  course management
    ✓ add new course (5 ms)
    ✓ get list (1 ms)
    ✓ get detail (1 ms)
    ✓ delete course (1 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        3.102 s
Ran all test suites matching /src\/tests\/service.spec.ts/i.
```


## Apis

### Create Course
```bash
POST /v1/courses
----------------
Req Body:

{
    "title": "google2",
    "slug": "ada-fi-google-2",
    "description": "inideskripsi",
    "author_id": "ca18cd3b-a941-40df-86c3-693fd5eaa3d7",
    "content": "kontenpanjang"
}
```

### Update Course
```bash
PUT /v1/courses/{id}
----------------
Req Body:

{
    "title": "google2",
    "slug": "ada-fi-google-2",
    "description": "inideskripsi",
    "author_id": "ca18cd3b-a941-40df-86c3-693fd5eaa3d7",
    "content": "kontenpanjang"
}
```

### List all courses
```bash
GET /v1/courses
----------------
```

### Course by id
```bash
GET /v1/courses/{id}
----------------
```

### Delete Course by id
```bash
DELETE /v1/courses/{id}
----------------
```


## System Design (in bahasa)

![eduqat](https://github.com/alfiankan/course-api/assets/40946917/6629fc0a-da14-4c3e-9d74-d053236e1038)


Pada design di atas saya menggunakan lambda function untuk semua service dan MySQL (managed) RDS untuk database primary write dan Dynamodb sebagai read. Pattern yang saya gunakan adalah CQRS (Command Query Responsibility Segregation) untuk membuat service dapat di scale lebih mudah mengingat.

Dengan CQRS kita dapat scale hanya untuk function enroll, contohnya ketika terjadi flash sale atau traffic pembelian course sedang tinggi. dan tetap membiarkan function yang low traffic seperti management course yang asumsinya akan lebih sedikit tetap dalam skalabilitas kecil (secukupnya) sehingga akan menghemat cost.
Pada course function untuk Query (list, detail, search) course sudah dipisahkan menjadi service khusus query yang akan read dari dynamodb (read db) yang sudah terintegrasi dan memiliki full text search yang advance dan baik.
Ketika terjadi flash sale atau enroll course yang sangat tinggi kita dapat scale spesifik hanya untuk search dan list course dan enroll.

Dengan design diatas akan membuat sistem lebih fleksibel dan scalable sesuai kebutuhan tanpa mengganggu fungsionalitas lain, karena function juga sudah dipisahkan jika contohnya terjadi error pada course management (contohnya tidak bisa menambah course) user tetap bisa enroll course.

pada design diatas proses segregation data dari write ke read db dilakukan directly namun bisa juga menggunakan event sourcing dari RDS.
pada design diatas untuk service identity tidak dibuat cqrs karena melihat kebutuhan yang kecil, mengingat pada desain ini saya asumsikan fe dan be mengimplementasikan stateless auth JWT, sehingga begitu authenticated sudah tidak perlu melakukan interaksi dengan service identity.

