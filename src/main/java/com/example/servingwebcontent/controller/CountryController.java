package com.example.servingwebcontent.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;

import com.example.servingwebcontent.entity.CountryEntity;
import com.example.servingwebcontent.form.CountryForm;
import com.example.servingwebcontent.form.CountrySearchForm;
import com.example.servingwebcontent.form.TestForm;
import com.example.servingwebcontent.repository.CountryEntityMapper;
import com.example.servingwebcontent.utils.CommonResult;
import com.google.gson.Gson;

@Controller
public class CountryController {

	@Autowired
	private CommonResult result;
	
	@Autowired
	private Gson gson;
	@Autowired
	private CountryEntityMapper mapper;

	/**
	 * The String class represents character strings.
	 */
	@GetMapping("/list")
	public String list(TestForm testForm) {
		// String names = "countrys";
		// List<CountryEntity> list = mapper.select(SelectDSLCompleter.allRows());
		// model.addAttribute(names, list);
		// model.addAttribute("testForm", new TestForm());
		return "list";
	}

	@PostMapping("/create")
	@ResponseBody
	public String createTestCountry(TestForm testForm) {

		// create new entity
		CountryEntity entity = new CountryEntity();
		// set country cd
		entity.setMstcountrycd(testForm.getCd());
		// set country name
		entity.setMstcountrynanme(testForm.getName());
		// insert record
		mapper.insert(entity);

		// clear form attrib
		testForm.setCd("");
		testForm.setName("");

		return "这是自己写的回给前端的信息";
	}

	@GetMapping("/country")
	public String init(Model model) {

		model.addAttribute("countrySearchForm", new CountrySearchForm());
		model.addAttribute("countryForm", new CountryForm());
		return "country/country";
	}

	/**
	 * Represents a sequence of characters. In this context, it is used to return a
	 * JSON representation of a CountryEntity object.
	 */
	@PostMapping("/country/getCountry")
	@ResponseBody
	public String getCountry(@Validated CountrySearchForm countrySearchForm,CountryForm countryForm, BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
		}

		/**
		 * Optional object containing the result of the database query for the country
		 * with the specified country code.
		 */
		Optional<CountryEntity> countryEntity = mapper.selectByPrimaryKey(countrySearchForm.getMstCountryCd());
		if (countryEntity == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		}
		countryForm.setCountryCode(countryEntity.get().getMstcountrycd());
		countryForm.setName(countryEntity.get().getMstcountrynanme());

		return new Gson().toJson(countryForm);
	}

	/**
	 * Returns the name of the view template to render for creating a country.
	 *
	 * @param countryForm the form object containing the country data
	 * @return the name of the view template for adding a country
	 */
	@GetMapping("/country/create")
	public String create(CountryForm countryForm) {
		return "addCountry";
	}

	/**
	 * Creates a new country in the database based on the provided country form.
	 * 
	 * @param countryForm the country form containing the details of the country to
	 *                    be created
	 * @return a string message to be sent back to the frontend
	 */
	@PostMapping("/country/creat")
	@ResponseBody
	public String createCountry(CountryForm countryForm) {

		// create new entiry
		CountryEntity countryEntity = new CountryEntity();
		countryEntity.setMstcountrycd(countryForm.getCountryCode());
		countryEntity.setMstcountrynanme(countryForm.getName());

		// insert into database
		mapper.insert(countryEntity);

		countryForm.setCountryCode("");
		countryForm.setName("");
		
		result.setStatus(0);
		result.setMessage("新規を成功しました");

		return gson.toJson(result);
	}
	@PostMapping("/country/update")
	@ResponseBody
	public String updateCountry(CountryForm countryForm) {
		
		// create new entiry
		CountryEntity countryEntity = new CountryEntity();
		countryEntity.setMstcountrycd(countryForm.getCountryCode());
		countryEntity.setMstcountrynanme(countryForm.getName());
		
		mapper.updateByPrimaryKey(countryEntity);
		
		countryForm.setCountryCode("");
		countryForm.setName("");
		
		result.setStatus(0);
		result.setMessage("修正を成功しました");
		
		return gson.toJson(result);
	}
	@PostMapping("/country/delete")
	@ResponseBody
	public String deleteCountry(CountryForm countryForm) {
		
		
		mapper.deleteByPrimaryKey(countryForm.getCountryCode());
		
		countryForm.setCountryCode("");
		countryForm.setName("");
		
		result.setStatus(0);
		result.setMessage("削除を成功しました");
		
		return gson.toJson(result);
	}

}
