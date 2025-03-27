<?php

class RideCount extends Model {
    protected $table = 'rides_count';

    public function findAll() {
        $query = "SELECT vehicle_type, completed_rides FROM {$this->table}";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateCount($vehicleType) {
        $query = "UPDATE {$this->table} SET completed_rides = completed_rides + 1 WHERE vehicle_type = ?";
        return $this->db->execute($query, [$vehicleType]);
    }
}