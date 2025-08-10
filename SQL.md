### 1. `Harvest` テーブルの作成

`Harvest`エンティティに基づいてテーブルを作成します。`availableSlots`はPostgreSQLの`JSONB`型で、`imageData`は`TEXT`型で表現します。

```sql
CREATE TABLE IF NOT EXISTS Harvest (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    price DOUBLE PRECISION,
    image_url TEXT,
    available_slots JSONB, -- Map<LocalDate, Integer> を JSONB で保存
    category VARCHAR(255),
    start_date DATE,
    end_date DATE,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(255),
    image_data TEXT -- Base64エンコードされた画像データ
);
```

### 2. `Reservation` テーブルの作成

`Reservation`エンティティに基づいてテーブルを作成します。

```sql
CREATE TABLE IF NOT EXISTS Reservation (
    id BIGSERIAL PRIMARY KEY,
    harvest_id BIGINT NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    reservation_date DATE,
    number_of_participants INTEGER,
    status VARCHAR(50), -- 'Pending', 'Confirmed', 'Cancelled'
    FOREIGN KEY (harvest_id) REFERENCES Harvest(id)
);
```

### 3. サンプルデータの挿入

上記のテーブルにサンプルデータを挿入します。`available_slots`の`JSONB`形式に注意してください。

#### `Harvest` サンプルデータ

```sql
INSERT INTO Harvest (name, description, location, price, image_url, available_slots, category, start_date, end_date, contact_email, contact_phone, image_data) VALUES
('いちご狩り体験', '甘くて新鮮ないちごを自分で摘み取れる体験です。', '〇〇農園', 2500.00, 'https://example.com/strawberry.jpg', '{"2024-08-20": 10, "2024-08-21": 15, "2024-08-22": 5}', 'fruit', '2024-08-20', '2024-09-15', 'info@example.com', '090-1234-5678', 'base64_encoded_strawberry_image_data_here'),
('トマト収穫体験', '完熟トマトを収穫し、その場で試食もできます。', '△△ファーム', 1800.00, 'https://example.com/tomato.jpg', '{"2024-09-01": 8, "2024-09-02": 12}', 'vegetable', '2024-09-01', '2024-09-30', 'contact@example.com', '080-9876-5432', 'base64_encoded_tomato_image_data_here'),
('ぶどう狩り体験', '様々な種類のぶどうを味わえる体験です。', '□□ぶどう園', 3000.00, 'https://example.com/grape.jpg', '{"2024-09-10": 7, "2024-09-11": 10}', 'fruit', '2024-09-10', '2024-10-05', 'grape@example.com', '070-1122-3344', 'base64_encoded_grape_image_data_here');
```

#### `Reservation` サンプルデータ

`harvest_id`は、上記の`Harvest`テーブルに挿入されたデータの`id`に合わせてください。もし`id`が1から始まる場合、以下のSQLをそのまま利用できます。

```sql
INSERT INTO Reservation (harvest_id, user_id, user_name, user_email, reservation_date, number_of_participants, status) VALUES
(1, 'user_clerk_id_1', '山田 太郎', 'yamada.taro@example.com', '2024-08-20', 2, 'Confirmed'),
(1, 'user_clerk_id_2', '鈴木 花子', 'suzuki.hanako@example.com', '2024-08-21', 3, 'Pending'),
(2, 'user_clerk_id_1', '山田 太郎', 'yamada.taro@example.com', '2024-09-01', 1, 'Pending'),
(3, 'user_clerk_id_3', '田中 健太', 'tanaka.kenta@example.com', '2024-09-10', 4, 'Confirmed');
```

### 実行手順

1.  Supabaseダッシュボードにログインし、対象のプロジェクトを選択します。
2.  左側のメニューから「SQL Editor」をクリックします。
3.  上記の`CREATE TABLE`文をそれぞれコピー＆ペーストし、実行します。
4.  次に、`INSERT`文をコピー＆ペーストし、実行します。