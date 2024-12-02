import eventModels from "../models/event.models.js";

class EventController {
  static async getAll(req, res) {
    const { page = 1, limit = 10, status, search } = req.query;

    try {
      const filters = {};

      if (status) filters.status = status;
      if (search) filters.title = { $regex: search, $options: "i" };

      const events = await eventModels
        .find(filters)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .populate("articles");

      const totalEvents = await eventModels.countDocuments(filters);

      res.status(200).json({
        totalEvents,
        totalPages: Math.ceil(totalEvents / Number(limit)),
        currentPage: Number(page),
        events,
      });
    } catch (err) {
      res.status(500).json({ message: "Error fetching events", error: err });
    }
  }

  static async getBySlug(req, res) {
    const { slug } = req.params;

    try {
      const event = await eventModels
        .findOne({ slug })
        .sort({ createdAt: -1 })
        .populate("articles");
      if (!event) return res.status(404).json({ message: "Event not found" });
      res.status(200).json(event);
    } catch (err) {
      res.status(500).json({ message: "Error fetching event", error: err });
    }
  }

  static async create(req, res) {
    try {
      const { title, slug, articles } = req.body;
      if (!title || !slug || !articles?.length)
        return res.status(400).json({ message: "All fields are required" });

      const newEvent = new eventModels({
        title,
        slug,
        articles,
      });
      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (err) {
      res.status(500).json({ message: "Internal Sevrer Error" });
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const { title, status, articles } = req.body;

    try {
      if (!title || !status || !articles?.length) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const event = await eventModels.findById(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      event.title = title;
      event.status = status;
      event.articles = articles;

      await event.save();

      res.status(200).json({ message: "Event updated successfully", event });
    } catch (err) {
      res.status(500).json({ message: "Error updating event", error: err });
    }
  }

  static async delete(req, res) {
    const { id } = req.params;

    try {
      const event = await eventModels.findById(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      await event.deleteOne();

      res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting event", error: err });
    }
  }
}

export default EventController;
