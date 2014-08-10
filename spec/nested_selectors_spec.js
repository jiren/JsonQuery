describe("Nested Objects", function(){
  var Service;
  var Movies;

  beforeEach(function(){
    jasmine.addMatchers(customMatchers);

    Movie = JsonQuery(movies_data);
    Service = JsonQuery(services_data);
  });

  describe("equal", function(){
    it("with equal operator - object -> array", function(){
      services = Service.where({'service_categories.category_id': 31}).exec();

      expect(2).toBe(services.length);

      $.each(services, function(){
        expect(this.service_categories[0].category_id).toBe(31);
      });

    });

    it("with equal operator - object -> object", function(){
      var name = "Jeffery O'Conner I";
      services = Service.where({'nonprofit.name': name}).exec();

      expect(2).toBe(services.length);

      $.each(services, function(){
        expect(this.nonprofit.name).toBe(name);
      });

    });

    it("with equal operator - object -> array -> object", function(){
      var id = '12'
      services = Service.where({'nonprofit.nonprofit_categories.to_param': id}).exec();

      expect(2).toBe(services.length);

      $.each(services, function(){
        expect(this.nonprofit.nonprofit_categories[0].to_param).toBe(id);
      });

    });

    it("with equal operator - array", function(){
      var id = 70964;
      services = Service.where({'user_ids': id}).exec();

      expect(1).toBe(services.length);

      $.each(services, function(){
        expect(this.user_ids).toContain(id);
      });

    });
  })
});
