describe("Nested Objects with Array of Array", function(){
  var Vendor;

  beforeEach(function(){
    jasmine.addMatchers(customMatchers);

    Vendor = JsonQuery(vendors_data);
  });

  describe("equal", function(){
    it("with equal operator - object -> array -> array", function(){
      vendors = Vendor.where({'vendors.agewise_price.age': 100}).all;

      expect(1).toBe(vendors.length);

      $.each(vendors, function(){
        expect(this.vendors[0].agewise_price[0].age).toBe(100);
      });

    });

    it("with equal operator - object -> array -> array with multiple condition", function(){
      var vendor_name = "BHARTI AXA";
      vendors = Vendor.where({'vendors.agewise_price.age': 100, 'vendors.vendor': vendor_name}).all;

      expect(1).toBe(vendors.length);

      $.each(vendors, function(){
        expect(this.vendors[0].agewise_price[0].age).toBe(100);
        expect(this.vendors[0].vendor).toBe(vendor_name);
      });

    });

  })
});
