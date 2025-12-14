# Cập nhật Field Khu vực (locationId)

## Tổng quan
Đã cập nhật field **"Khu vực" (locationId)** từ input text sang select dropdown với danh sách 30 tỉnh/thành phố của Việt Nam.

## Thay đổi về kiểu dữ liệu

### Frontend
- **Kiểu dữ liệu**: `Number` (Integer)
- **Giá trị mặc định**: `0` (Chọn tỉnh/thành phố...)
- **Range**: 0 - 30

### Backend Requirements
Backend cần:
1. Accept `locationId` là kiểu **Integer** (không phải String)
2. Mapping ID sang tên tỉnh thành nếu cần hiển thị
3. Validation: locationId phải từ 1-30 (0 là giá trị chưa chọn)

## Danh sách Tỉnh/Thành phố và ID

| ID | Tên Tỉnh/Thành phố |
|----|-------------------|
| 0  | Chọn tỉnh/thành phố... (default) |
| 1  | Hà Nội |
| 2  | TP. Hồ Chí Minh |
| 3  | Đà Nẵng |
| 4  | Hải Phòng |
| 5  | Cần Thơ |
| 6  | Huế |
| 7  | Nha Trang |
| 8  | Vũng Tàu |
| 9  | Đà Lạt |
| 10 | Biên Hòa |
| 11 | Thủ Dầu Một |
| 12 | Hải Dương |
| 13 | Hưng Yên |
| 14 | Bắc Ninh |
| 15 | Nam Định |
| 16 | Thái Nguyên |
| 17 | Hạ Long |
| 18 | Vinh |
| 19 | Thanh Hóa |
| 20 | Quy Nhơn |
| 21 | Buôn Ma Thuột |
| 22 | Pleiku |
| 23 | Phan Thiết |
| 24 | Long Xuyên |
| 25 | Mỹ Tho |
| 26 | Rạch Giá |
| 27 | Cà Mau |
| 28 | Bến Tre |
| 29 | Vĩnh Long |
| 30 | Sóc Trăng |

## Ví dụ Request từ Frontend

### POST /api/rooms (Tạo phòng mới)
```json
{
  "title": "Phòng trọ cao cấp",
  "description": "Phòng rộng, đầy đủ tiện nghi",
  "price": 3000000,
  "latitude": 10.762622,
  "longitude": 106.660172,
  "address": "123 Nguyễn Văn Linh, Quận 7",
  "locationId": 2,
  "categoryId": 2,
  "waterCost": 20000,
  "publicElectricCost": 3500,
  "internetCost": 100000,
  "assets": [
    {"name": "Giường", "number": 1},
    {"name": "Tủ lạnh", "number": 1}
  ]
}
```

### PUT /api/rooms/{id} (Cập nhật phòng)
```json
{
  "id": 123,
  "title": "Phòng trọ cao cấp",
  "locationId": 1,
  ...
}
```

## Mapping Backend (Đề xuất)

### Java Entity/DTO
```java
public class Room {
    private Long id;
    private String title;
    private Integer locationId;  // Kiểu Integer, không phải String
    // ... other fields
}
```

### Validation
```java
@Min(value = 1, message = "Vui lòng chọn tỉnh/thành phố")
@Max(value = 30, message = "ID tỉnh/thành phố không hợp lệ")
private Integer locationId;
```

### Enum (Tuỳ chọn)
Nếu muốn quản lý chặt chẽ hơn, có thể tạo enum:

```java
public enum Location {
    HA_NOI(1, "Hà Nội"),
    HO_CHI_MINH(2, "TP. Hồ Chí Minh"),
    DA_NANG(3, "Đà Nẵng"),
    HAI_PHONG(4, "Hải Phòng"),
    CAN_THO(5, "Cần Thơ"),
    HUE(6, "Huế"),
    NHA_TRANG(7, "Nha Trang"),
    VUNG_TAU(8, "Vũng Tàu"),
    DA_LAT(9, "Đà Lạt"),
    BIEN_HOA(10, "Biên Hòa"),
    THU_DAU_MOT(11, "Thủ Dầu Một"),
    HAI_DUONG(12, "Hải Dương"),
    HUNG_YEN(13, "Hưng Yên"),
    BAC_NINH(14, "Bắc Ninh"),
    NAM_DINH(15, "Nam Định"),
    THAI_NGUYEN(16, "Thái Nguyên"),
    HA_LONG(17, "Hạ Long"),
    VINH(18, "Vinh"),
    THANH_HOA(19, "Thanh Hóa"),
    QUY_NHON(20, "Quy Nhơn"),
    BUON_MA_THUOT(21, "Buôn Ma Thuột"),
    PLEIKU(22, "Pleiku"),
    PHAN_THIET(23, "Phan Thiết"),
    LONG_XUYEN(24, "Long Xuyên"),
    MY_THO(25, "Mỹ Tho"),
    RACH_GIA(26, "Rạch Giá"),
    CA_MAU(27, "Cà Mau"),
    BEN_TRE(28, "Bến Tre"),
    VINH_LONG(29, "Vĩnh Long"),
    SOC_TRANG(30, "Sóc Trăng");

    private final Integer id;
    private final String name;

    Location(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public static Location fromId(Integer id) {
        for (Location location : values()) {
            if (location.id.equals(id)) {
                return location;
            }
        }
        throw new IllegalArgumentException("Invalid location ID: " + id);
    }
}
```

### Service Method Example
```java
public String getLocationName(Integer locationId) {
    return Location.fromId(locationId).getName();
}
```

## Files đã được cập nhật

1. **src/page/rentaler/AddRoom.js**
   - Đổi từ `<input type="text">` sang `<select>`
   - Thêm 30 options tỉnh/thành phố
   - locationId: kiểu Number

2. **src/page/rentaler/EditRoom.js**
   - Tương tự như AddRoom.js
   - Đảm bảo consistency khi edit phòng

## Testing Checklist

- [ ] Backend accept locationId kiểu Integer
- [ ] Validation: locationId từ 1-30
- [ ] GET /api/rooms trả về locationId đúng format
- [ ] POST /api/rooms với locationId = 2 (TP.HCM) thành công
- [ ] PUT /api/rooms cập nhật locationId thành công
- [ ] Filter rooms theo locationId hoạt động
- [ ] Display tên tỉnh/thành phố thay vì ID trong UI

## Lưu ý Migration

Nếu DB đã có dữ liệu cũ:
1. Kiểm tra kiểu dữ liệu cột `location_id` trong database (phải là INT/INTEGER)
2. Update dữ liệu cũ nếu đang lưu string:
   ```sql
   UPDATE rooms SET location_id = 1 WHERE location_id = 'Hà Nội' OR location_id = 'Ha Noi';
   UPDATE rooms SET location_id = 2 WHERE location_id = 'TP.HCM' OR location_id = 'Ho Chi Minh';
   -- ... các case khác
   ```
3. Thêm constraint:
   ```sql
   ALTER TABLE rooms ADD CONSTRAINT check_location_id CHECK (location_id >= 1 AND location_id <= 30);
   ```

## API Response Example

### GET /api/rooms/{id}
```json
{
  "id": 123,
  "title": "Phòng trọ cao cấp",
  "locationId": 2,
  "locationName": "TP. Hồ Chí Minh",  // Optional: Backend có thể thêm field này
  "address": "123 Nguyễn Văn Linh, Quận 7",
  ...
}
```

### GET /api/rooms?locationId=2 (Filter)
Query params để lọc theo tỉnh/thành phố:
```
GET /api/rooms?locationId=2&page=0&size=20
```

---

**Ngày cập nhật**: 13/12/2025  
**Người thực hiện**: Frontend Team  
**Trạng thái**: ✅ Hoàn thành Frontend, đang chờ Backend update
