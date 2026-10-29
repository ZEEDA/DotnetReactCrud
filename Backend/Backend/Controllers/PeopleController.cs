using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PeopleController : ControllerBase
{
    // Post /api/people         {body: Person}
    // GET /api/people
    // GET /api/people/2
    // PUT /api/people/2     {body: Person}
    // DELETE /api/people/2


    private readonly AppDbContext _context;

    public PeopleController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost] // Post /api/people
    public async Task<IActionResult> AddPerson(Person person)
    {
        try
        {
            _context.People.Add(person);
            await _context.SaveChangesAsync();
            return CreatedAtRoute("GetPerson", new { id = person.Id }, person); // Return the 201 status code + location of the resouce (http://localhost:3000/api/people/{id}) + the created person object
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // Return a 500 internal server error response with the exception message
        }
    }

    [HttpGet] // GET /api/people
    public async Task<IActionResult> GetPeople()
    {
        try
        {
            var people = await _context.People.ToListAsync();
            return Ok(people); // Return the 200 ok response with the list of people
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // Return a 500 internal server error response with the exception message
        }
    }

    [HttpGet("{id:int}", Name = "GetPerson")] // GET /api/people/2
    public async Task<IActionResult> GetPerson(int id)
    {
        try
        {
            var person = await _context.People.FindAsync(id);
            if (person is null)
            {
                return NotFound(); // Return a 404 not found response if the person does not exist
            }
            return Ok(person); // Return the 200 ok response with the person object
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // Return a 500 internal server error response with the exception message
        }
    }

    [HttpPut("{id:int}")] // PUT /api/people/2
    public async Task<IActionResult> UpdatePerson(int id, [FromBody] Person person)
    {
        try
        {
            if (id != person.Id)
            {
                return BadRequest("The ID in the URL does not match the ID in the body."); // Return a 400 bad request response if the id in the URL does not match the id in the body
            }

            if (!await _context.People.AnyAsync(p => p.Id == id))
            {
                return NotFound(); // Return a 404 not found response if the person does not exist
            }

            _context.People.Update(person);
            await _context.SaveChangesAsync();
            return NoContent(); // Return a 204 no content response to indicate the update was successful
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // Return a 500 internal server error response with the exception message
        }
    }

    [HttpDelete("{id:int}")] // DELETE /api/people/2
    public async Task<IActionResult> DeletePerson(int id)
    {
        try
        {
            var person = await _context.People.FindAsync(id);

            if(person is null)
            {
                return NotFound(); // 404 not found status code
            }

            _context.People.Remove(person);
            await _context.SaveChangesAsync();
            return NoContent(); // Return a 204 no content response to indicate the deletion was successful
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // Return a 500 internal server error response with the exception message
        }
    }
}
